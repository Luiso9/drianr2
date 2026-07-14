import { AwsClient } from 'aws4fetch'

export async function createPresignedUploadUrl(
  env: { R2_ACCOUNT_ID: string; R2_ACCESS_KEY_ID: string; R2_SECRET_ACCESS_KEY: string },
  bucketName: string,
  key: string,
  contentType: string
): Promise<string> {
  const client = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  })

  const endpoint = new URL(
    `${env.R2_ACCOUNT_ID}/${bucketName}/${encodeR2Key(key)}`
  )
  endpoint.searchParams.set('X-Amz-Expires', '900')
  console.log(endpoint.toString())

  const signed = await client.sign(
    new Request(endpoint.toString(), {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
    }),
    { aws: { signQuery: true } }
  )

  return signed.url
}

function encodeR2Key(key: string): string {
  return key.split('/').map(encodeURIComponent).join('/')
}
