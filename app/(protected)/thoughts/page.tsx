
'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bold, Italic, Underline, List, ImageIcon, Plus, Type, Palette } from 'lucide-react'

export default function ThoughtPage() {
  const [cards, setCards] = useState([
    { id: 1, content: '', color: 'bg-white' },
    { id: 2, content: '', color: 'bg-white' },
    { id: 3, content: '', color: 'bg-white' },
  ])
  const [images, setImages] = useState<string[]>([])
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const addCard = () => {
    setCards([...cards, { id: Date.now(), content: '', color: 'bg-white' }])
  }

  const updateCardContent = (id: number, content: string) => {
    setCards(cards.map(card => card.id === id ? { ...card, content } : card))
  }

  const changeCardColor = (id: number, color: string) => {
    setCards(cards.map(card => card.id === id ? { ...card, color } : card))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages([...images, reader.result as string])
      }
      reader.readAsDataURL(file)
    }
  }

  const applyTextStyle = (style: string) => {
    const textarea = textAreaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    let newText = ''
    switch (style) {
      case 'bold':
        newText = `**${selectedText}**`
        break
      case 'italic':
        newText = `*${selectedText}*`
        break
      case 'underline':
        newText = `_${selectedText}_`
        break
      case 'list':
        newText = selectedText.split('\n').map(line => `• ${line}`).join('\n')
        break
    }

    const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
    const cardId = Number(textarea.getAttribute('data-card-id'))
    updateCardContent(cardId, newContent)
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-5xl font-bold font-playfair text-center my-12">Too much chaos? Let's organize it.</h1>
      
      <div className="flex justify-center space-x-2 m-8  p-4 rounded-lg shadow-sm">
        <Button variant="outline" size="icon" onClick={() => applyTextStyle('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => applyTextStyle('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => applyTextStyle('underline')}>
          <Underline className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => applyTextStyle('list')}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Type className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-wrap gap-1">
              {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'].map(color => (
                <Button
                  key={color}
                  className={`w-8 h-8 rounded-full ${color}`}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <label htmlFor="file-upload">
          <Button variant="outline" size="icon" asChild>
            <span><ImageIcon className="h-4 w-4" /></span>
          </Button>
        </label>
        <Input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <Button onClick={addCard}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <Card key={card.id} className={`p-4 ${card.color}`}>
            <textarea
              ref={textAreaRef}
              data-card-id={card.id}
              className="w-full h-32 resize-none bg-transparent focus:outline-none"
              value={card.content}
              onChange={(e) => updateCardContent(card.id, e.target.value)}
              placeholder="Write your thoughts here..."
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  <Palette className="h-4 w-4 mr-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <div className="flex flex-wrap gap-1">
                  {['bg-white', 'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200'].map(color => (
                    <Button
                      key={color}
                      className={`w-8 h-8 rounded-full ${color}`}
                      onClick={() => changeCardColor(card.id, color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </Card>
        ))}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Uploaded image ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
          ))}
        </div>
      )}
    </div>
  )
}