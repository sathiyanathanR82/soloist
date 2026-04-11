# Soloist Network & Messages Implementation TODO

## Step 1: Backend Updates (Messages Storage)
- [ ] Update ../soloist-backend/src/models/User.ts: Add `messages: [{withUserId: string, messages: [{from, to, text, timestamp, isInvite?}][]}][]` to network.
- [ ] Update network controller: sendRequest stores inviteMessage in request.metadata.message.
- [ ] approveRequest: On approve, add inviteMessage to both users' messages as first message.
- [ ] Add /network/messages/:userId GET (get conversation).
- [ ] Add /network/messages/:userId POST (send message).

## Step 2: Frontend Structure
- [ ] Create src/app/components/messages/messages.component.ts/html/scss (standalone, list connections + chat).
- [ ] src/app/app-routing.module.ts: Add /messages route.
- [ ] src/app/components/navbar/navbar.component.ts/html: Add Messages button/badge.

## Step 3: Services
- [ ] src/app/services/network.service.ts: Add getConversation(userId), sendMessage(userId, text), update inviteMessage in sendRequest.

## Step 4: UI Features
- [ ] src/app/components/home/home.component.ts/html: MatDialog for invite message popup.
- [ ] src/app/components/network/network.component.html: Display invite message in pending requests.
- [ ] src/app/components/network/network.component.ts: Load messages preview?

## Step 5: Polish & Test
- [ ] Update user.model.ts if needed.
- [ ] Test flows: send invite → approve → message.
- [ ] Backend: npm run dev, Frontend: ng serve.
- [ ] Mark complete.

**Next:** Starting Step 1 - Read backend files.

