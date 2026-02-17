# Padrão de Sincronização do Editor (Sync-Before-Mount)

## O Problema (Cold Start / Race Condition)

Ao carregar o editor pela primeira vez (ou em conexões lentas), observamos um problema onde o editor **CodeMirror** era inicializado **antes** que o provedor **Yjs** (`y-websocket`) tivesse recebido o conteúdo inicial do backend.

Isso resultava em:

1. O usuário via um editor vazio.
2. O documento Yjs era atualizado milissegundos depois com o conteúdo do servidor.
3. O CodeMirror, já inicializado com uma string vazia, não refletia essa atualização inicial corretamente ou causava conflitos de estado.
4. O usuário precisava recarregar a página para ver o conteúdo.

## A Solução: Sync-Before-Mount

Para resolver isso, refatoramos o `EditorPage.tsx` para garantir que o componente visual do editor (CodeMirror) **só seja montado após a confirmação de sincronização**.

### Fluxo de Implementação

1.  **Estado de Sincronização**:
    Introduzimos um estado local `isSynced`:

    ```tsx
    const [isSynced, setIsSynced] = useState(false);
    ```

2.  **Listener do Provedor**:
    No `useEffect` de inicialização do WebSocket, escutamos o evento `synced`:

    ```tsx
    wsProvider.on('synced', ({ synced }) => {
      setIsSynced(synced);
    });
    ```

    Este evento é disparado pelo `y-websocket` quando a troca inicial de vetores de estado (Handshake step 1 & 2) é concluída.

3.  **Renderização Condicional**:
    Na UI, exibimos um "Loader" enquanto `isSynced` for falso. O container do editor só é renderizado quando `isSynced` é verdadeiro.

    ```tsx
    {
      !isSynced ? (
        <CircularProgress /> // Mostra "Syncing..."
      ) : (
        <div ref={editorRef} /> // Monta o CodeMirror com dados garantidos
      );
    }
    ```

4.  **Inicialização do CodeMirror**:
    O `useEffect` que cria a `EditorView` agora depende de `isSynced`.

    ```tsx
    useEffect(() => {
      if (!isSynced || !provider) return;
      // Agora é seguro: provider.doc.getText() contém os dados do backend
    ```

5.  **Fallback de Segurança**:
    Para evitar que o usuário fique preso no estado de carregamento caso o evento de sincronização falhe ou demore muito (ex: firewall bloqueando WebSocket), implementamos um **timeout de 3 segundos**.
    ```tsx
    setTimeout(() => {
      setIsSynced((prev) => {
        if (!prev) console.warn('Force syncing after timeout');
        return true;
      });
    }, 3000);
    ```

## Benefícios

- **Consistência Garantida**: O usuário nunca vê um estado intermediário ou vazio incorreto.
- **UX Melhorada**: Feedback visual ("Syncing...") informa que a conexão está sendo estabelecida.
- **Robustez**: Funciona independentemente da latência da rede ou do tamanho do documento.
