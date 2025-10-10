"use client"

import { useState, useCallback } from "react"
import { OBSConnection } from "@/src/lib/obs-connection"
import { useToast } from "@/src/hooks/use-toast"

export function useOBSConnection() {
  const [connection, setConnection] = useState<OBSConnection | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const connect = useCallback(
    async (url: string, password?: string) => {
      setIsConnecting(true)
      try {
        const obs = new OBSConnection()
        await obs.connect(url, password)
        setConnection(obs)
        toast({
          title: "Connected to OBS",
          description: "Successfully connected to OBS WebSocket",
        })
      } catch (error: any) {
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to connect to OBS",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsConnecting(false)
      }
    },
    [toast],
  )

  const disconnect = useCallback(async () => {
    if (connection) {
      await connection.disconnect()
      setConnection(null)
      toast({
        title: "Disconnected",
        description: "Disconnected from OBS",
      })
    }
  }, [connection, toast])

  return {
    connection,
    isConnected: connection?.isConnected() ?? false,
    isConnecting,
    connect,
    disconnect,
  }
}
