import Logo from '@/components/Logo'

export default function Sucesso() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,90,122,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-md relative text-center">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="card">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Dependentes cadastrados!
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Seus dependentes foram registrados com sucesso no s2 Clube.
            Em breve eles receberão acesso aos benefícios.
          </p>

          <div
            className="p-4 rounded-xl text-sm text-left space-y-2"
            style={{ background: '#fff0f3' }}
          >
            <p className="font-semibold text-gray-800">Próximos passos:</p>
            <p className="text-gray-600">✓ Seus dependentes foram salvos em nosso sistema</p>
            <p className="text-gray-600">✓ O acesso ao clube será liberado em até 24h</p>
            <p className="text-gray-600">✓ Eles receberão um e-mail com as instruções</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Dúvidas? Entre em contato com nosso suporte.
        </p>
      </div>
    </main>
  )
}
