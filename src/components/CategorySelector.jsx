import { FileCode, DollarSign, FileX, GraduationCap, Heart } from 'lucide-react'

const categories = [
  {
    id: 'medical-coding',
    name: 'Medical Coding',
    icon: FileCode,
    description: 'ICD-10, CPT, HCPCS coding guidance',
    color: 'bg-blue-500'
  },
  {
    id: 'healthcare-rcm',
    name: 'Healthcare RCM',
    icon: DollarSign,
    description: 'Revenue cycle management',
    color: 'bg-green-500'
  },
  {
    id: 'claims-denials',
    name: 'Claims & Denials',
    icon: FileX,
    description: 'Claim processing and denial management',
    color: 'bg-red-500'
  },
  {
    id: 'career-guidance',
    name: 'Career Guidance',
    icon: GraduationCap,
    description: 'Medical Coding / RCM careers',
    color: 'bg-purple-500'
  },
  {
    id: 'general-healthcare',
    name: 'General Healthcare Knowledge',
    icon: Heart,
    description: 'Healthcare operations and best practices',
    color: 'bg-orange-500'
  }
]

function CategorySelector({ onSelect }) {
  return (
    <div className="w-full max-w-4xl px-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
        What type of healthcare query would you like help with?
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Select a category to get specialized assistance from our healthcare AI assistant
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.name)}
              className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left group"
            >
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">
                {category.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategorySelector
