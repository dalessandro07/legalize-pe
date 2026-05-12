import path from 'node:path'
import { createGitService } from '@legalize-pe/git'
import type { APIRoute } from 'astro'

export const prerender = false

// Validación de seguridad para prevenir path traversal e inyección
const VALID_ID_PATTERN = /^[a-z0-9-]+$/
const VALID_HASH_PATTERN = /^[a-f0-9]{7,40}$/

export const GET: APIRoute = async ({ params }) => {
  const { id, commit } = params

  if (!id || !commit) {
    return new Response(JSON.stringify({ error: 'Parámetros requeridos: id, commit' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!VALID_ID_PATTERN.test(id)) {
    return new Response(JSON.stringify({ error: 'Identificador inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!VALID_HASH_PATTERN.test(commit)) {
    return new Response(JSON.stringify({ error: 'Hash de commit inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const repoPath = path.join(process.cwd(), '..', '..')
    const gitService = createGitService(repoPath)
    const version = await gitService.getContentAtCommit(id, commit)

    return new Response(JSON.stringify({ data: version }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching version:', error)
    return new Response(
      JSON.stringify({ error: 'Error al obtener la versión' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
