# Using secrets in GitHub Actions - GitHub Docs
Secrets allow you to store sensitive information in your organization, repository, or repository environments.

[About secrets](#about-secrets)
-------------------------------

Secrets are variables that you create in an organization, repository, or repository environment. The secrets that you create are available to use in GitHub Actions workflows. GitHub Actions can only read a secret if you explicitly include the secret in a workflow.

For secrets stored at the organization-level, you can use access policies to control which repositories can use organization secrets. Organization-level secrets let you share secrets between multiple repositories, which reduces the need for creating duplicate secrets. Updating an organization secret in one location also ensures that the change takes effect in all repository workflows that use that secret.

For secrets stored at the environment level, you can enable required reviewers to control access to the secrets. A workflow job cannot access environment secrets until approval is granted by required approvers.

**Note**: If your GitHub Actions workflows need to access resources from a cloud provider that supports OpenID Connect (OIDC), you can configure your workflows to authenticate directly to the cloud provider. This will let you stop storing these credentials as long-lived secrets and provide other security benefits. For more information, see "[About security hardening with OpenID Connect](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)"

### [Naming your secrets](#naming-your-secrets)

The following rules apply to secret names:

*   Names can only contain alphanumeric characters (`[a-z]`, `[A-Z]`, `[0-9]`) or underscores (`_`). Spaces are not allowed.
    
*   Names must not start with the `GITHUB_` prefix.
    
*   Names must not start with a number.
    
*   Names are case insensitive.
    
*   Names must be unique at the level they are created at.
    
    For example, a secret created at the environment level must have a unique name in that environment, a secret created at the repository level must have a unique name in that repository, and a secret created at the organization level must have a unique name at that level.
    
    If a secret with the same name exists at multiple levels, the secret at the lowest level takes precedence. For example, if an organization-level secret has the same name as a repository-level secret, then the repository-level secret takes precedence. Similarly, if an organization, repository, and environment all have a secret with the same name, the environment-level secret takes precedence.
    

To help ensure that GitHub redacts your secret in logs, avoid using structured data as the values of secrets. For example, avoid creating secrets that contain JSON or encoded Git blobs.

### [Accessing your secrets](#accessing-your-secrets)

To make a secret available to an action, you must set the secret as an input or environment variable in the workflow file. Review the action's README file to learn about which inputs and environment variables the action expects. For more information, see "[Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsenv)."

You can use and read secrets in a workflow file if you have access to edit the file. For more information, see "[Access permissions on GitHub](https://docs.github.com/en/get-started/learning-about-github/access-permissions-on-github)."

**Warning:** If a secret was used in the job, GitHub automatically redacts secrets printed to the log. You should avoid printing secrets to the log intentionally.

Organization and repository secrets are read when a workflow run is queued, and environment secrets are read when a job referencing the environment starts.

You can also manage secrets using the REST API. For more information, see "[REST API endpoints for GitHub Actions Secrets](https://docs.github.com/en/rest/actions/secrets)."

### [Limiting credential permissions](#limiting-credential-permissions)

When generating credentials, we recommend that you grant the minimum permissions possible. For example, instead of using personal credentials, use [deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#deploy-keys) or a service account. Consider granting read-only permissions if that's all that is needed, and limit access as much as possible.

When generating a personal access token (classic), select the fewest scopes necessary. When generating a fine-grained personal access token, select the minimum permissions and repository access required.

Instead of using a personal access token, consider using a GitHub App, which uses fine-grained permissions and short lived tokens, similar to a fine-grained personal access token. Unlike a personal access token, a GitHub App is not tied to a user, so the workflow will continue to work even if the user who installed the app leaves your organization. For more information, see "[Making authenticated API requests with a GitHub App in a GitHub Actions workflow](https://docs.github.com/en/apps/creating-github-apps/guides/making-authenticated-api-requests-with-a-github-app-in-a-github-actions-workflow)."

**Note:** Users with collaborator access to a repository can use the REST API to manage secrets for that repository, and users with admin access to an organization can use the REST API to manage secrets for that organization. For more information, see "[REST API endpoints for GitHub Actions Secrets](https://docs.github.com/en/rest/actions/secrets)."

[Creating secrets for a repository](#creating-secrets-for-a-repository)
-----------------------------------------------------------------------

To create secrets or variables on GitHub for a personal account repository, you must be the repository owner. To create secrets or variables on GitHub for an organization repository, you must have `admin` access. Lastly, to create secrets or variables for a personal account repository or an organization repository through the REST API, you must have collaborator access.

[Creating secrets for an environment](#creating-secrets-for-an-environment)
---------------------------------------------------------------------------

To create secrets or variables for an environment in a personal account repository, you must be the repository owner. To create secrets or variables for an environment in an organization repository, you must have `admin` access. For more information on environments, see "[Using environments for deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)."

[Creating secrets for an organization](#creating-secrets-for-an-organization)
-----------------------------------------------------------------------------

**Note:** Organization-level secrets and variables are not accessible by private repositories for GitHub Free. For more information about upgrading your GitHub subscription, see "[Upgrading your account's plan](https://docs.github.com/en/billing/managing-billing-for-your-github-account/upgrading-your-github-subscription)".

When creating a secret or variable in an organization, you can use a policy to limit access by repository. For example, you can grant access to all repositories, or limit access to only private repositories or a specified list of repositories.

Organization owners can create secrets or variables at the organization level.

[Reviewing access to organization-level secrets](#reviewing-access-to-organization-level-secrets)
-------------------------------------------------------------------------------------------------

You can check which access policies are being applied to a secret in your organization.

1.  On GitHub.com, navigate to the main page of the organization.
    
2.  Under your organization name, click **Settings**. If you cannot see the "Settings" tab, select the dropdown menu, then click **Settings**.
    
    ![Screenshot of the tabs in an organization's profile. The "Settings" tab is outlined in dark orange.](https://docs.github.com/assets/cb-55819/images/help/discussions/org-settings-global-nav-update.png)
    
3.  In the "Security" section of the sidebar, select **Secrets and variables**, then click **Actions**.
    
4.  The list of secrets includes any configured permissions and policies. For more details about the configured permissions for each secret, click **Update**.
    

[Using secrets in a workflow](#using-secrets-in-a-workflow)
-----------------------------------------------------------

**Notes:**

*   With the exception of `GITHUB_TOKEN`, secrets are not passed to the runner when a workflow is triggered from a forked repository.
    
*   Secrets are not automatically passed to reusable workflows. For more information, see "[Reusing workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows#passing-inputs-and-secrets-to-a-reusable-workflow)."
    

To provide an action with a secret as an input or environment variable, you can use the `secrets` context to access secrets you've created in your repository. For more information, see "[Contexts](https://docs.github.com/en/actions/learn-github-actions/contexts)" and "[Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)."

```
steps:
  - name: Hello world action
    with: 
      super_secret: ${{ secrets.SuperSecret }}
    env: 
      super_secret: ${{ secrets.SuperSecret }}

```


Secrets cannot be directly referenced in `if:` conditionals. Instead, consider setting secrets as job-level environment variables, then referencing the environment variables to conditionally run steps in the job. For more information, see "[Contexts](https://docs.github.com/en/actions/learn-github-actions/contexts#context-availability)" and [`jobs.<job_id>.steps[*].if`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsif).

If a secret has not been set, the return value of an expression referencing the secret (such as `${{ secrets.SuperSecret }}` in the example) will be an empty string.

Avoid passing secrets between processes from the command line, whenever possible. Command-line processes may be visible to other users (using the `ps` command) or captured by [security audit events](https://docs.microsoft.com/windows-server/identity/ad-ds/manage/component-updates/command-line-process-auditing). To help protect secrets, consider using environment variables, `STDIN`, or other mechanisms supported by the target process.

If you must pass secrets within a command line, then enclose them within the proper quoting rules. Secrets often contain special characters that may unintentionally affect your shell. To escape these special characters, use quoting with your environment variables. For example:

### [Example using Bash](#example-using-bash)

```
steps:
  - shell: bash
    env:
      SUPER_SECRET: ${{ secrets.SuperSecret }}
    run: |
      example-command "$SUPER_SECRET"

```


### [Example using PowerShell](#example-using-powershell)

```
steps:
  - shell: pwsh
    env:
      SUPER_SECRET: ${{ secrets.SuperSecret }}
    run: |
      example-command "$env:SUPER_SECRET"

```


### [Example using Cmd.exe](#example-using-cmdexe)

```
steps:
  - shell: cmd
    env:
      SUPER_SECRET: ${{ secrets.SuperSecret }}
    run: |
      example-command "%SUPER_SECRET%"

```


[Limits for secrets](#limits-for-secrets)
-----------------------------------------

You can store up to 1,000 organization secrets, 100 repository secrets, and 100 environment secrets.

A workflow created in a repository can access the following number of secrets:

*   All 100 repository secrets.
*   If the repository is assigned access to more than 100 organization secrets, the workflow can only use the first 100 organization secrets (sorted alphabetically by secret name).
*   All 100 environment secrets.

Secrets are limited to 48 KB in size. To store larger secrets, see the "[Storing large secrets](#storing-large-secrets)" workaround below.

### [Storing large secrets](#storing-large-secrets)

To use secrets that are larger than 48 KB, you can use a workaround to store secrets in your repository and save the decryption passphrase as a secret on GitHub. For example, you can use `gpg` to encrypt a file containing your secret locally before checking the encrypted file in to your repository on GitHub. For more information, see the "[gpg manpage](https://www.gnupg.org/gph/de/manual/r1023.html)."

**Warning**: Be careful that your secrets do not get printed when your workflow runs. When using this workaround, GitHub does not redact secrets that are printed in logs.

1.  Run the following command from your terminal to encrypt the file containing your secret using `gpg` and the AES256 cipher algorithm. In this example, `my_secret.json` is the file containing the secret.
    
    ```
gpg --symmetric --cipher-algo AES256 my_secret.json

```

    
2.  You will be prompted to enter a passphrase. Remember the passphrase, because you'll need to create a new secret on GitHub that uses the passphrase as the value.
    
3.  Create a new secret that contains the passphrase. For example, create a new secret with the name `LARGE_SECRET_PASSPHRASE` and set the value of the secret to the passphrase you used in the step above.
    
4.  Copy your encrypted file to a path in your repository and commit it. In this example, the encrypted file is `my_secret.json.gpg`.
    
    **Warning**: Make sure to copy the encrypted `my_secret.json.gpg` file ending with the `.gpg` file extension, and **not** the unencrypted `my_secret.json` file.
    
    ```
git add my_secret.json.gpg
git commit -m "Add new secret JSON file"

```

    
5.  Create a shell script in your repository to decrypt the secret file. In this example, the script is named `decrypt_secret.sh`.
    
    Shell
    
    ```
#!/bin/sh

# Decrypt the file
mkdir $HOME/secrets
# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \
--output $HOME/secrets/my_secret.json my_secret.json.gpg

```

    
6.  Ensure your shell script is executable before checking it in to your repository.
    
    ```
chmod +x decrypt_secret.sh
git add decrypt_secret.sh
git commit -m "Add new decryption script"
git push

```

    
7.  In your GitHub Actions workflow, use a `step` to call the shell script and decrypt the secret. To have a copy of your repository in the environment that your workflow runs in, you'll need to use the [`actions/checkout`](https://github.com/actions/checkout) action. Reference your shell script using the `run` command relative to the root of your repository.
    
    ```
name: Workflows with large secrets

on: push

jobs:
  my-job:
    name: My Job
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Decrypt large secret
        run: ./decrypt_secret.sh
        env:
          LARGE_SECRET_PASSPHRASE: ${{ secrets.LARGE_SECRET_PASSPHRASE }}
      
      
      
      - name: Test printing your secret (Remove this step in production)
        run: cat $HOME/secrets/my_secret.json

```

    

[Storing Base64 binary blobs as secrets](#storing-base64-binary-blobs-as-secrets)
---------------------------------------------------------------------------------

You can use Base64 encoding to store small binary blobs as secrets. You can then reference the secret in your workflow and decode it for use on the runner. For the size limits, see "[Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#limits-for-secrets)."

**Note**: Note that Base64 only converts binary to text, and is not a substitute for actual encryption.

1.  Use `base64` to encode your file into a Base64 string. For example:
    
    On macOS, you could run:
    
    ```
base64 -i cert.der -o cert.base64

```

    
    On Linux, you could run:
    
    ```
base64 -w 0 cert.der > cert.base64

```

    
2.  Create a secret that contains the Base64 string. For example:
    
    ```
$ gh secret set CERTIFICATE_BASE64 < cert.base64
✓ Set secret CERTIFICATE_BASE64 for octocat/octorepo

```

    
3.  To access the Base64 string from your runner, pipe the secret to `base64 --decode`. For example:
    
    ```
name: Retrieve Base64 secret
on:
  push:
    branches: [ octo-branch ]
jobs:
  decode-secret:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Retrieve the secret and decode it to a file
        env:
          CERTIFICATE_BASE64: ${{ secrets.CERTIFICATE_BASE64 }}
        run: |
          echo $CERTIFICATE_BASE64 | base64 --decode > cert.der
      - name: Show certificate information
        run: |
          openssl x509 -in cert.der -inform DER -text -noout

```

    

**Note**: Using another shell might require different commands for decoding the secret to a file. On Windows runners, we recommend [using a bash shell](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsshell) with `shell: bash` to use the commands in the `run` step above.

[Redacting secrets from workflow run logs](#redacting-secrets-from-workflow-run-logs)
-------------------------------------------------------------------------------------

While GitHub automatically redacts secrets printed to workflow logs, runners can only delete secrets they have access to. This means a secret will only be redacted if it was used within a job. As a security measure, you can delete workflow run logs to prevent sensitive values being leaked. For more information, see "[Using workflow run logs](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs#deleting-logs)."