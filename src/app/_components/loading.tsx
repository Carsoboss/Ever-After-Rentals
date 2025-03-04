export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-300 border-t-transparent" />
    </div>
  )
}
