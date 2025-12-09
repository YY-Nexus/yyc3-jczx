import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-700 text-white">
          <CardTitle className="text-2xl">
            <Skeleton className="h-8 w-64 bg-white/20" />
          </CardTitle>
          <CardDescription className="text-sky-100 mt-2">
            <Skeleton className="h-4 w-96 bg-white/20" />
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Skeleton className="h-24 w-full mb-6" />

          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-40" />
        </CardFooter>
      </Card>
    </div>
  )
}
