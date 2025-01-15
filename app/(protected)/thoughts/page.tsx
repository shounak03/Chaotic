'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import {Underline } from '@tiptap/extension-underline'
import { FontSize } from '@tiptap/extension-font-size'
import BulletList from '@tiptap/extension-bullet-list'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bold, Italic,Underline as Underline2, List, ImageIcon, Type, Palette } from 'lucide-react'

export default function ThoughtPage() {
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [canvasColor, setCanvasColor] = useState('rgb(255, 255, 255)')
  const [fontSize, setFontSize] = useState('16px')
  const [textColor, setTextColor] = useState('#000000')

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontSize,
      Underline,
      BulletList,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor) {
      editor.chain().focus().setColor(textColor).run()
    }
  }, [textColor, editor])

  useEffect(() => {
    if (editor) {
      editor.chain().focus().setFontSize(fontSize).run()
    }
  }, [fontSize, editor])

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setImages([...images, reader.result as string])
    }
    reader.readAsDataURL(file)
  }

  const applyStyle = (style: string) => {
    if (editor) {
      switch (style) {
        case 'bold':
          editor.chain().focus().toggleBold().run()
          break
        case 'italic':
          editor.chain().focus().toggleItalic().run()
          break
        case 'underline':
          editor.chain().focus().toggleUnderline().run()
          break
        case 'bullet':
          editor.chain().focus().toggleBulletList().run()
          break
      }
    }
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(e.target.value)
  }

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value)
  }

  const handleCanvasColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasColor(e.target.value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold font-playfair text-center mb-8">Too much chaos? Let's organize it.</h1>
      
      <div className="flex flex-wrap justify-center items-center gap-2 p-4  rounded-lg shadow-sm mb-4">
        <Button  variant="outline" size="icon" onClick={() => applyStyle('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => applyStyle('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => applyStyle('underline')}>
          <Underline2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => applyStyle('bullet')}>
          <List className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <select
              value={fontSize}
              onChange={handleFontSizeChange}
              className="w-full p-2 border rounded"
            >
              {[12, 14, 16, 18, 20, 24, 30, 36, 48].map(size => (
                <option key={size} value={`${size}px`}>{size}px</option>
              ))}
            </select>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Text Color</label>
              <Input
                type="color"
                value={textColor}
                onChange={handleTextColorChange}
              />
              <label className="text-sm font-medium">Canvas Color</label>
              <Input
                type="color"
                value={canvasColor}
                onChange={handleCanvasColorChange}
              />
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
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleImageUpload(file)
          }}
        />
      </div>

      <Card 
        className="mt-4 p-4 overflow-auto"
        style={{ 
          backgroundColor: canvasColor,
          minHeight: 'calc(100vh - 300px)',
          maxHeight: 'calc(100vh - 300px)'
        }}
      >
        <EditorContent editor={editor} />
        {/* // className="min-h-[200px] focus:outline-none" /> */}

        {images.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <img key={index} src={image || "/placeholder.svg"} alt={`Uploaded image ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

