import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: experts } = await supabase
    .from('experts')
    .select(`
      *,
      expert_categories(
        categories(name, slug)
      )
    `)
    .order('name')

  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-white">Carnivore Experts</h1>
        <p className="text-gray-400 mb-8">Medical professionals and researchers in metabolic health</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts?.map((expert) => (
            <div key={expert.id} className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700">
              <h2 className="text-xl font-bold text-white">{expert.name}</h2>
              <p className="text-sm text-blue-400 font-medium mb-1">{expert.credentials} - {expert.specialty}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {expert.expert_categories?.map((ec: any) => (
                  <span key={ec.categories.slug} className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">
                    {ec.categories.name}
                  </span>
                ))}
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{expert.bio_summary}</p>
              
              <div className="text-xs text-gray-500">
                Alignment: {expert.alignment_score}/5 | {expert.is_practicing ? 'Practicing' : 'Educator'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}