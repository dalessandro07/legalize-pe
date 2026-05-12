import path from 'node:path'
import { createGitService } from '@legalize-pe/git'
import type { APIRoute } from 'astro'

export const prerender = false

// Validación de seguridad para prevenir path traversal
const VALID_ID_PATTERN = /^[a-z0-9-]+$/

export const GET: APIRoute = async ({ params }) => {
  const { id } = params

  if (!id) {
    return new Response(JSON.stringify({ error: 'Parámetro id requerido' }), {
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

  try {
    const repoPath = path.join(process.cwd(), '..', '..')
    const gitService = createGitService(repoPath)
    const commits = await gitService.getHistory(id)

    if (!commits || commits.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No se encontró historial para esta norma' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return new Response(JSON.stringify({ data: commits }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching history:', error)
    return new Response(
      JSON.stringify({ error: 'Error al obtener el historial' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
