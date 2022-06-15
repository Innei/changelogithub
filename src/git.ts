export async function getGitHubRepo() {
  const url = await execCommand('git', ['config', '--get', 'remote.origin.url'])
  const match = url.match(/github\.com[\/:]([\w\d._-]+?)\/([\w\d._-]+?)(\.git)?$/i)
  if (!match)
    throw new Error(`Can not parse GitHub repo from url ${url}`)
  return `${match[1]}/${match[2]}`
}

export async function getCurrentGitBranch() {
  return await execCommand('git', ['tag', '--points-at', 'HEAD']) || await execCommand('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
}

export async function getLastGitTag(delta = -1) {
  const tags = await execCommand('git', ['--no-pager', 'tag', '-l', '--sort=taggerdate']).then(r => r.split('\n'))
  return tags[tags.length + delta]
}

export async function isRefGitTag(to: string) {
  const { execa } = await import('execa')
  try {
    const res = await execa('git', ['describe', '--exact-match', to], { reject: true })
    return res.stdout.trim() === to
  }
  catch {
    return false
  }
}

export function isPrerelease(version: string) {
  return version.includes('-')
}

async function execCommand(cmd: string, args: string[]) {
  const { execa } = await import('execa')
  const res = await execa(cmd, args)
  return res.stdout.trim()
}

