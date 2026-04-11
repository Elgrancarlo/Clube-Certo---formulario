'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'
import DependenteForm, { DependenteData } from '@/components/DependenteForm'
import { validateCPF } from '@/lib/cpf'

const EMPTY_DEP: DependenteData = { nome: '', email: '', cpf: '', telefone: '' }

function getOfertaNum(oferta: string): number {
  if (oferta.includes('49.90')) return 1  // 5 acessos = titular + 4 deps
  if (oferta.includes('39.90')) return 2  // 3 acessos = titular + 2 deps
  if (oferta.includes('29.90')) return 3  // upsell
  return 1
}

function getSlots(oferta: string): number {
  const num = getOfertaNum(oferta)
  if (num === 1) return 4
  if (num === 2) return 2
  return 4
}

function CadastroContent() {
  const router = useRouter()
  const params = useSearchParams()
  const cpfTitular = params.get('cpf') ?? ''

  const [titular, setTitular] = useState<{ nome: string; oferta: string | null } | null>(null)
  const [loadingTitular, setLoadingTitular] = useState(true)
  const [dependentes, setDependentes] = useState<DependenteData[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!cpfTitular) {
      router.replace('/')
      return
    }

    fetch('/api/validar-cpf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: cpfTitular }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.found) {
          router.replace('/')
          return
        }
        // Oferta não preenchida — plano não identificado
        if (!data.oferta) {
          setTitular({ nome: data.nome, oferta: null })
          setLoadingTitular(false)
          return
        }
        // Redirect upsell for oferta3
        if (getOfertaNum(data.oferta) === 3) {
          router.replace(`/upsell?cpf=${cpfTitular}`)
          return
        }
        setTitular({ nome: data.nome, oferta: data.oferta })
        const slots = getSlots(data.oferta)
        setDependentes(Array.from({ length: slots }, () => ({ ...EMPTY_DEP })))
      })
      .catch(() => router.replace('/'))
      .finally(() => setLoadingTitular(false))
  }, [cpfTitular, router])

  function updateDependente(index: number, data: DependenteData) {
    setDependentes((prev) => prev.map((d, i) => (i === index ? data : d)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    const filled = dependentes.filter((d) => d.nome.trim() || d.cpf.trim())
    if (filled.length === 0) {
      setSubmitError('Preencha pelo menos um dependente.')
      return
    }

    for (const dep of filled) {
      if (!dep.nome.trim()) {
        setSubmitError('Preencha o nome de todos os dependentes iniciados.')
        return
      }
      if (!validateCPF(dep.cpf.replace(/\D/g, ''))) {
        setSubmitError(`CPF inválido: ${dep.nome || 'dependente'}`)
        return
      }
      if (!dep.email.trim()) {
        setSubmitError(`Preencha o e-mail de ${dep.nome || 'dependente'}.`)
        return
      }
      if (!dep.telefone.trim()) {
        setSubmitError(`Preencha o telefone de ${dep.nome || 'dependente'}.`)
        return
      }
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/cadastrar-dependentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpfTitular, dependentes: filled }),
      })

      if (res.ok) {
        router.push('/sucesso')
      } else {
        const data = await res.json()
        setSubmitError(data.error ?? 'Erro ao cadastrar. Tente novamente.')
      }
    } catch {
      setSubmitError('Erro de conexão. Verifique sua internet.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingTitular) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#E85A7A]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-gray-500 text-sm">Carregando...</span>
        </div>
      </main>
    )
  }

  if (!titular) return null

  // Oferta não identificada — bloquear acesso
  if (!titular.oferta) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8"><Logo size="md" /></div>
          <div className="card text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">Plano não identificado</h1>
            <p className="text-sm text-gray-500 mb-4">
              Não foi possível identificar o plano de <strong>{titular.nome}</strong>.
              Entre em contato com o suporte para regularizar sua assinatura.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-outline"
              style={{ width: 'auto', padding: '0.625rem 1.5rem', display: 'inline-flex' }}
            >
              ← Voltar
            </button>
          </div>
        </div>
      </main>
    )
  }

  const slots = getSlots(titular.oferta)

  return (
    <main className="min-h-screen px-4 py-10">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,90,122,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo size="md" />
        </div>

        {/* Greeting */}
        <div className="card mb-6 text-center">
          <p className="text-gray-500 text-sm mb-1">Bem-vindo(a),</p>
          <h1 className="text-lg font-bold text-gray-900">{titular.nome}</h1>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: '#fff0f3', color: '#E85A7A' }}>
            <span>❤️</span>
            {slots === 4 ? 'Plano Família (até 4 dependentes)' : 'Plano Duo (até 2 dependentes)'}
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#E85A7A] flex items-center justify-center text-white text-xs font-bold">✓</div>
            <span className="text-xs text-gray-500">CPF verificado</span>
          </div>
          <div className="flex-1 h-px bg-[#E85A7A]" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #E85A7A, #C94068)' }}>2</div>
            <span className="text-xs font-medium text-gray-800">Cadastrar dependentes</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="text-sm text-gray-500 mb-4">
            Preencha os dados dos dependentes que deseja adicionar ao seu plano.
            Campos não preenchidos serão ignorados.
          </p>

          {dependentes.map((dep, i) => (
            <DependenteForm key={i} index={i} data={dep} onChange={updateDependente} />
          ))}

          {submitError && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <span className="mt-0.5">⚠️</span>
              <span>{submitError}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Salvando...
              </>
            ) : (
              'Cadastrar dependentes →'
            )}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function Cadastro() {
  return (
    <Suspense>
      <CadastroContent />
    </Suspense>
  )
}
