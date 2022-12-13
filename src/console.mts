/**
 * A basic logger function.
 */

export type Logan = (...data: any[]) => void

export const logan = (namespace: any): Logan => {
  return (...data: any[]) => {
    console.debug(`${namespace}:`, ...data)
  }
}

const frogLogo = " ()~() \n(-___-)\n==`-'=="
export const logInfo = (version: string, width: number, height: number): void => {
  const logo = frogLogo.split('\n')

  const content = [
    '',
    ` ${logo[0]}  Ribbit.js `,
    ` ${logo[1]}  v${version} `,
    ` ${logo[2]}  ${width}x${height} `,
    '',
  ]
  const maxContentLength = Math.max(...content.map((l) => l.length))

  const lines = content.map((l) => `%c %c %c ${l.padEnd(maxContentLength, ' ')} %c %c `)

  const styling = [
    'background: #3f6212',
    'background: #4d7c0f',
    'background: #65a30d; color: #ecfccb; font-weight: bold',
    'background: #4d7c0f',
    'background: #3f6212',
  ]

  console.log(lines.join('\n'), ...Array.from({ length: lines.length }, () => styling).flat())
}
