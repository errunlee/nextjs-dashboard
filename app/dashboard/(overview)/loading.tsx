import React from 'react'
import DashboardSkeleton from '@/app/ui/skeletons'

type Props = {}

const loading = (props: Props) => {
  return (
    <div><DashboardSkeleton/></div>
  )
}

export default loading