const tl = require('azure-pipelines-task-lib/task');
const axios = require('axios');

async function run() {
    try {
        const apiUrl = tl.getInput('apiUrl', true);
        const pat = tl.getInput('personalAccessToken', true);
        const customHeadersInput = tl.getInput('customHeaders', false);

        const project = tl.getVariable('SYSTEM_TEAMPROJECT');
        const buildId = tl.getVariable('BUILD_BUILDID');
        const organizationUrl = tl.getVariable('SYSTEM_COLLECTIONURI');

        if (!pat) {
            throw new Error('Personal Access Token is required');
        }

        const auth = Buffer.from(`:${pat}`).toString('base64');
        const logUrls = await collectLogUrls(organizationUrl, project, buildId, auth, 30000); // 30초 동안 로그 URL 수집
        const logs = await fetchLogsFromUrls(logUrls, auth, parseCustomHeaders(customHeadersInput));

        await axios.post(apiUrl, { log: logs }, { headers: parseCustomHeaders(customHeadersInput) });

        console.log('Logs sent successfully.');
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

// 커스텀 헤더를 파싱하여 객체로 변환하는 함수
function parseCustomHeaders(input) {
    const headers = {};
    if (input) {
        const pairs = input.split(',');  // 쉼표로 구분된 각 key:value 쌍 분리
        pairs.forEach(pair => {
            const [key, ...valueParts] = pair.split(':');
            const value = valueParts.join(':').trim(); // ':' 이후의 값을 합쳐서 처리
            if (key && value) {
                headers[key.trim()] = value;
            }
        });
    }
    return headers;
}

// 로그 URL을 수집하는 함수
async function collectLogUrls(organizationUrl, project, buildId, auth, maxDuration) {
    let logUrls = [];
    const startTime = Date.now();
    let logCount = 0;

    while (Date.now() - startTime < maxDuration) {
        const url = `${organizationUrl}${project}/_apis/build/builds/${buildId}/logs?api-version=6.0`;
        console.log(`Requesting build logs from: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        const logs = response.data.value;

        if (logs.length > logCount) {
            for (let i = logCount; i < logs.length; i++) {
                logUrls.push(logs[i].url);
                console.log(`Collected log URL: ${logs[i].url}`);
            }
            logCount = logs.length;
        }

        // 5초 동안 대기 후 추가 로그 수집
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return logUrls;
}

// 수집한 로그 URL로부터 로그 내용을 가져오는 함수
async function fetchLogsFromUrls(logUrls, auth, customHeaders) {
    let allLogs = '';

    for (const logUrl of logUrls) {
        console.log(`Requesting individual log from: ${logUrl}`);

        const logResponse = await axios.get(logUrl, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                ...customHeaders
            },
            responseType: 'text'
        });

        console.log(`Received log content: ${logResponse.data}`);
        allLogs += logResponse.data + '\n';
    }

    return allLogs;
}

run();
