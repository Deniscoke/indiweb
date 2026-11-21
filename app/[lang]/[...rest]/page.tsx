import { notFound } from 'next/navigation'

// Catches every address under a language that is no page, so the 404 is drawn
// by not-found.tsx inside the layout, in that language. Next marks every 404
// response noindex itself; metadata exported here would not reach the page.
export default function UnknownPage() {
  notFound()
}
