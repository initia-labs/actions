# create-release

A github action that creates tag and release. It is typescript version of [actions/create-release](https://github.com/actions/create-release).

## Example usage
```yaml
    name: Create Tag & Release

    on:
      push:
        branches:
          - main

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - name: get versions
            id: get_version
            run: |
              echo github.actor
              version=$(echo '${{ github.event.head_commit.message }}' | egrep -o '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')
              echo "version=v$version" >> $GITHUB_OUTPUT
          - name: make release
            uses: initia-labs/actions/create-release@main
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            with:
              tag_name: ${{ steps.get_version.outputs.version }}
              release_name: ${{ steps.get_version.outputs.version }}
```

## Variables
* **tag_name**: name of the tag for this release
* **release_name**: name of the release
* body [optional]:  text describing the contents of the release. Not required if using `body_path`
* body_path [optional]: path to a file describing the contents of the release. Not required if using `body`
* draft [optional]: set to `true` to create a draft (unpublished) release; defaults to `false`
* prerelease [optional]: set to `true` for a prerelease. `false` for a full release; defaults to `false`
* commitish [optional]: the branch or commit SHA the git tag is created from. Unused if the git tag already exists; defaults to the SHA of the current commit
* owner [optional]: the repository owner's username, used for identifying the repository when releasing for external repositories; defaults to the current owner
* repo [optional]: the repository name, used for identifying the repository when releasing for external repositories; defaults to the current repository

## Outputs
* id: the release ID
* html_url: URL to view the release
* upload_url: URL for uploading assets to the release
