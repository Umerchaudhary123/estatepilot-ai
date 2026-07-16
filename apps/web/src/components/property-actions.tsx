'use client'
import { Check, MessageCircle, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui'
export function SharePropertyButton({title}:{title:string}){const [copied,setCopied]=useState(false);async function share(){if(navigator.share)await navigator.share({title,url:location.href});else{await navigator.clipboard.writeText(location.href);setCopied(true);setTimeout(()=>setCopied(false),1800)}}return <Button variant="outline" onClick={share}>{copied?<Check size={16}/>:<Share2 size={16}/>} {copied?'Link copied':'Share'}</Button>}
export function AskAIButton({title}:{title:string}){return <Button variant="ghost" style={{width:'100%'}} onClick={()=>window.dispatchEvent(new CustomEvent('estatepilot-open-chat',{detail:`Tell me about ${title}`}))}><MessageCircle size={16}/>Ask AI about this home</Button>}
