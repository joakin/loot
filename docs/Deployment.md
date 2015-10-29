Deployment
==========

Currently loot is deployed in staging at
`http://reading-web-research.wmflabs.org/`.

* Deployment is done via git push.
  * `git push wmflabs master`
  * Bare git repo is at `/home/loot/loot.git/`.
  * Working copy is at `/home/loot/loot/`.

### Be a deployer

Assuming you've got access to the wmflabs instance:

* Add yourself to the loot group once sshd into the machine:
  * `sudo usermod -a -G loot <username>`
* Add the remote to deploy to in you local repo:
  * `git remote add wmflabs <username>@reading-web-research.eqiad.wmflabs:/home/loot/loot.git`
* Profit: `git push wmflabs master`

### Notes

* For changing user to *loot* if you've sshd into reading-web-research, do:
  * `sudo su && su loot && bash`
* `post-receive` hook that checks out and restarts process is at
`/home/loot/post-receive`.
* When `git push`ing to production you may see *Killed by signal 1.* in the
  output. That's something from ProxyCommand, should be safe to ignore.
* To reset the git repo in the staging server, log in and go to `/home/loot` and run:
  * `rm -rf loot.git && mkdir loot.git && cd loot.git && git init --bare && cd .. && cp post-receive loot.git/hooks/`
  * After the above, you should be able to `git push wmflabs master` and get
    a new repo that will execute the post-receive hook.
