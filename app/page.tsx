'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { formatCPF, cleanCPF, validateCPF } from '@/lib/cpf'

export default function Home() {
  const router = useRouter()
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotFound(false)

    const clean = cleanCPF(cpf)
    if (!validateCPF(clean)) {
      setError('CPF inválido. Verifique os números e tente novamente.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/validar-cpf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: clean }),
      })

      if (res.ok) {
        router.push(`/cadastro?cpf=${clean}`)
      } else if (res.status === 404) {
        setNotFound(true)
      } else {
        const data = await res.json()
        setError(data.error ?? 'Erro ao verificar CPF.')
      }
    } catch {
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,90,122,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-md relative">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Cadastro de Dependentes
            </h1>
            <p className="text-gray-500 text-sm">
              Digite o CPF do titular para começar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                CPF do Titular
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => {
                  setCpf(formatCPF(e.target.value))
                  setError(null)
                  setNotFound(false)
                }}
                maxLength={14}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {notFound && (
              <div className="p-4 bg-[#fff5f7] border border-[#fcd4dd] rounded-xl text-center space-y-3">
                <p className="text-sm text-gray-700">
                  <strong>CPF não encontrado.</strong> Você ainda não possui um
                  plano ativo no s2 Clube.
                </p>
                <a
                  href={process.env.NEXT_PUBLIC_SALES_URL ?? '#'}
                  style={{
                    background: 'linear-gradient(135deg, #E85A7A 0%, #C94068 100%)',
                    color: 'white',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    display: 'inline-block',
                    textDecoration: 'none',
                  }}
                >
                  Quero assinar agora →
                </a>
              </div>
            )}

            {!notFound && (
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Verificando...
                  </>
                ) : (
                  'Continuar →'
                )}
              </button>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Seus dados estão protegidos e seguros.
        </p>
      </div>
    </main>
  )
}
