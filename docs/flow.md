# Flow

## Host Creates Session

```
Home (pick topic + year)
  → Topic Screen (pick avatar + name, hit Start)
      → onSubmit:
          1. signInAnonymously()     ← get a UID
          2. createSession()         ← batch write session/player/rounds
          3. router.replace()        ← navigate to lobby
  → Lobby Screen (/[topic]/[year]/[session])
      - Real-time listener on players subcollection
      - Host sees player list update as friends join
      - Share button builds deep link from inviteCode
          whatoftheyear://games/2025/{sessionId}
          or https://whatoftheyear.com/games/2025/{sessionId}
      - "Start Game" button (host only)
          → sets session.isOpen = false
          → router.replace() → round 1
```

## Friend Joins Session

```
Friend taps deep link → Topic Screen with session param
  → they enter name + avatar, hit Join
      → onSubmit:
          1. signInAnonymously()
          2. joinSession()           ← write to players subcollection
          3. router.replace()        ← navigate to lobby
  → Lobby Screen (same as host's)
      - Sees player list in real-time
      - Waits for host to start
      - When session.isOpen flips to false → router.replace() → round 1
```
