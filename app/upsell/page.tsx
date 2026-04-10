'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'

const SALES_URL = process.env.NEXT_PUBLIC_SALES_URL ?? '#'

const plans = [
  {
    id: 'oferta2',
    name: 'Plano Duo',
    subtitle: '3 acessos',
    deps: 2,
    highlight: false,
    description: 'Você + 2 dependentes',
    features: ['2 dependentes inclusos', 'Descontos em saúde', 'Telemedicina', 'Clube de vantagens'],
  },
  {
    id: 'oferta1',
    name: 'Plano Família',
    subtitle: '5 acessos',
    deps: 4,
    highlight: true,
    description: 'Você + 4 dependentes',
    features: ['4 dependentes inclusos', 'Descontos em saúde', 'Telemedicina', 'Clube de vantagens', 'Prioridade no suporte'],
  },
]

function UpsellContent() {
  const params = useSearchParams()
  const cpf = params.get('cpf')

  return (
    <main className="min-h-screen px-4 py-10">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,90,122,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-2xl mx-auto relative">
        <div className="flex flex-col items-center mb-8">
          <Logo size="md" />
        </div>

        <div className="card mb-8 text-center">
          <div className="text-3xl mb-3">💝</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Seu plano atual não inclui dependentes
          </h1>
          <p className="text-gray-500 text-sm">
            Faça um upgrade e inclua sua família no s2 Clube!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="card relative"
              style={
                plan.highlight
                  ? { border: '2px solid #E85A7A', boxShadow: '0 4px 24px rgba(232,90,122,0.15)' }
                  : {}
              }
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #E85A7A, #C94068)' }}
                >
                  Mais popular
                </div>
              )}

              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
                <p className="text-sm text-gray-500">{plan.description}</p>
                <div
                  className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: '#fff0f3', color: '#E85A7A' }}
                >
                  {plan.subtitle}
                </div>
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <span style={{ color: '#E85A7A' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={SALES_URL}
                className={plan.highlight ? 'btn-primary' : 'btn-outline'}
                style={{ textDecoration: 'none' }}
              >
                Fazer upgrade
              </a>
            </div>
          ))}
        </div>

        {cpf && (
          <p className="text-center text-xs text-gray-400">
            Após o upgrade, volte aqui com o CPF{' '}
            <strong>{cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</strong> para
            cadastrar seus dependentes.
          </p>
        )}
      </div>
    </main>
  )
}

export default function Upsell() {
  return (
    <Suspense>
      <UpsellContent />
    </Suspense>
  )
}
