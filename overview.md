# Task Log Notifier

Task Log Notifier is an Azure DevOps extension that sends pipeline task logs to a specified API or Webhook based on task success or failure. This extension helps you monitor and manage your DevOps processes by providing real-time feedback from your pipeline tasks.

## Features

- **Log Transmission**: Automatically send logs from your Azure DevOps pipeline tasks to an API or Webhook.
- **Custom Headers**: Add custom headers to your API requests for enhanced flexibility.

## Usage

1. **Add Task to Pipeline**: Include the Task Log Notifier task in your pipeline.
2. **Configure Inputs**:
   - **API URL**: Enter the API or Webhook URL.
   - **Personal Access Token**: Provide a PAT for Azure DevOps REST API access.
   - **Custom Headers**: Optionally add custom headers in the `key:value` format.

3. **Set Conditions**: Use conditions like `failed()`, `succeeded()`, or `always()` to control when the task runs.

## Example

```yaml
steps:
- task: TaskLogNotifier@1
  condition: always()
  inputs:
    personalAccessToken: $(PAT)
    apiUrl: 'https://example.com/webhook'
    customHeaders: 'Authorization:Bearer $(AuthToken)'
```

## Support

For support or feedback, visit our [GitHub repository](https://github.com/NerdyNot/TaskLogNotifier).