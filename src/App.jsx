import { useState } from 'react'
import TextUploader from './components/TextUploader'
import SpiritGallery from './components/SpiritGallery'

function App() {
  const [parsedText, setParsedText] = useState(null)
  const [selectedSpirits, setSelectedSpirits] = useState([])
  const [error, setError] = useState(null)

  const handleTextParsed = (result) => {
    setParsedText(result)
    setError(null)
  }

  const handleError = (err) => {
    setError(err.message)
    console.error('Error:', err)
  }

  const handleSpiritSelect = (spirits) => {
    setSelectedSpirits(spirits)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          👻 The Haunted Reader
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Summon the spirits to interpret your text...
        </p>

        {/* Error display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-900/20 border-2 border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Text Uploader */}
        <div className="max-w-2xl mx-auto mb-12">
          <TextUploader
            onTextParsed={handleTextParsed}
            onError={handleError}
          />
        </div>

        {/* Spirit Gallery - Show after text is uploaded */}
        {parsedText && (
          <div className="mb-12">
            <SpiritGallery
              onSpiritSelect={handleSpiritSelect}
              selectedSpirits={selectedSpirits}
              multiSelect={true}
              maxSelections={5}
            />
          </div>
        )}

        {/* Debug info */}
        {selectedSpirits.length > 0 && (
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">
              Selected spirits: {selectedSpirits.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
