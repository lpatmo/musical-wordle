## Getting Started

1. Fork this repository
2. `git clone [URL]`
3. `git remote add upstream [URL OF MAIN REPO]`

   Note: the URL of the main repo is https://github.com/lpatmo/musical-wordle.git. You can find this by clicking ont he "code" button dropdown on https://github.com/lpatmo/musical-wordle.

## How to create a new branch

`git checkout -b [BRANCHNAME]`

## How to delete a branch

`git branch -D [BRANCHNAME]`

## How to pull the latest changes from upstream main so that it lands inside your fork

1. `git checkout main`
2. `git pull upstream main`
   This assumes that `upstream` refers to the main repo at https://github.com/lpatmo/musical-wordle.git which you can check if you type `git remote -v`

If you're in a branch and you want your branch to get the latest updates, do:

3. `git checkout [BRANCH]`
4. `git rebase main`
5. `git push --force`

## How to pull and run the branches of a forked repo for a PR that you are reviewing

1. `git remote add [NICKNAME] [URL]` (Go to the user's forked repo and find the URL of the repo)
2. `git fetch [NICKNAME]`
3. `git checkout [NICKNAME]/[BRANCH NAME]` e.g. `git checkout alan/issue-5`
4. `git branch` to double check which branch you are in.
5. `npm start` from inside this branch to check out the PR changes from the forked repo.
6. When you are done, `git checkout main` to go back to your own `main` branch.

## Best practice for reviewing and committing code

1. Try to comment on individual lines in PRs. If everything looks good, you can type `LGTM`.
2. When committing, try to prefix commits with the issue you are working on. For example: `git commit -am "[ISSUE-15] Update docs with some best practices"`
