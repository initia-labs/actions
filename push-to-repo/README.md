# push-to-repo Action

A github action that copies files or directories from the current repository to another and commit the changes.

## Example usage
```yaml
    name: push to other repo
    on:
      release:
        types: [published]

    jobs:
      copy-files:
        runs-on: ubuntu-latest

      steps:
        - name: checkout
          uses: actions/checkout@v4

        - name: push files from A to B
          uses: initia/actions/push-to-repo
          env:
            TOKEN_GITHUB: ${{secrets.TOKEN_GITHUB}}
          with:
            sources: |
              path_of_A/some_dir
              path_of_A/some_dir
            destination-username: 'SeUkKim'
            destination-repo: 'B'
            email: 'eleccookie@gmail.com'
            commit-msg: 'test on push ${{github.event.release.tag_name}}'
```

## Variables
* **TOKEN_GITHUB**: the github token (personal token)
* **sources**: files/directories to copy to the destination repository
* **destination-username**: name/org of the destination username/org
* **destination-repo**: name of the destination repository
* destination-branch: [optional] branch name of the destination repository. default 'main'
* destination-dir: [optional] destination directory to copy files. default 'root'
* **email**: email for the commit
* commit-username: [optional] username for the commit. default 'destination-username'
* **commit-msg**: commit message