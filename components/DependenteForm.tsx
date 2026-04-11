'use client'

import { formatCPF, formatPhone } from '@/lib/cpf'

export interface DependenteData {
  nome: string
  email: string
  cpf: string
  telefone: string
}

interface Props {
  index: number
  data: DependenteData
  onChange: (index: number, data: DependenteData) => void
}

export default function DependenteForm({ index, data, onChange }: Props) {
  const set = (field: keyof DependenteData, value: string) => {
    onChange(index, { ...data, [field]: value })
  }

  return (
    <div className="card mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #E85A7A, #C94068)' }}
        >
          {index + 1}
        </div>
        <h3 className="font-semibold text-gray-800">Dependente {index + 1}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome completo <span className="text-[#E85A7A]">*</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Nome do dependente"
            value={data.nome}
            onChange={(e) => set('nome', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF <span className="text-[#E85A7A]">*</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="000.000.000-00"
            value={data.cpf}
            onChange={(e) => set('cpf', formatCPF(e.target.value))}
            maxLength={14}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail <span className="text-[#E85A7A]">*</span>
          </label>
          <input
            type="email"
            className="input-field"
            placeholder="email@exemplo.com"
            value={data.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone <span className="text-[#E85A7A]">*</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="(11) 99999-9999"
            value={data.telefone}
            onChange={(e) => set('telefone', formatPhone(e.target.value))}
            maxLength={15}
          />
        </div>
      </div>
    </div>
  )
}
