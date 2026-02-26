'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface UseWebSocketOptions {
  onMessage: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useWebSocket({ onMessage, onOpen, onClose }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectDelay = useRef(1000);
  const intentionalClose = useRef(false);

  // Store callbacks in refs so the connect function doesn't need them as deps
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  onMessageRef.current = onMessage;
  onOpenRef.current = onOpen;
  onCloseRef.current = onClose;

  const connect = useCallback(() => {
    // Guard against duplicate connections (OPEN or still CONNECTING)
    const state = wsRef.current?.readyState;
    if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) return;

    // Clean up any previous socket
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current = null;
    }

    intentionalClose.current = false;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? `ws://${window.location.host}/bible/api/chat`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      reconnectDelay.current = 1000;
      onOpenRef.current?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageRef.current(data);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      onCloseRef.current?.();

      // Auto-reconnect with exponential backoff (unless intentionally closed)
      if (!intentionalClose.current) {
        reconnectTimeout.current = setTimeout(() => {
          reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000);
          connect();
        }, reconnectDelay.current);
      }
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, []); // No deps — callbacks accessed via refs

  const disconnect = useCallback(() => {
    intentionalClose.current = true;
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    return () => {
      intentionalClose.current = true;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      wsRef.current?.close();
    };
  }, []);

  return { connect, disconnect, send, isConnected };
}
