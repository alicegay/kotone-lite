import { useQuery } from '@tanstack/react-query'
import { sessions, users } from 'jellyfin-api'
import useClient from 'hooks/useClient'

const useSessions = () => {
  const client = useClient()

  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await sessions.sessions(client.api)
      const filtered = res.filter((item) => item.UserId === client.user)
      if (filtered.length > 0) return filtered[0]
      throw new Error('No sessions')
    },
  })
}

export default useSessions
