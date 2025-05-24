import ProtectedRoute from "~~/components/ProtectedRoute"
import MyMarks from "~~/components/sections/myMarks"

export default function MyMarksPage() {
  return (
    <ProtectedRoute>
      <MyMarks />
    </ProtectedRoute>
  )
}