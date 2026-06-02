import asyncio
from app.sockets import ConnectionManager

class FakeWebSocket:
    def __init__(self, name):
        self.name = name
        self.sent = []
        self.accepted = False

    async def accept(self):
        self.accepted = True

    async def send_json(self, message):
        # emulate small send delay
        await asyncio.sleep(0)
        self.sent.append(message)

async def main():
    manager = ConnectionManager()

    ws1 = FakeWebSocket('ws1')
    ws2 = FakeWebSocket('ws2')

    # connect with different types to ensure str normalization works
    await manager.connect('1', ws1)
    await manager.connect(2, ws2)

    await manager.send_personal_message(1, {'msg': 'personal to 1'})
    await manager.send_personal_message('2', {'msg': 'personal to 2'})

    await manager.broadcast({'msg': 'broadcast to all'})

    print('ws1.sent =', ws1.sent)
    print('ws2.sent =', ws2.sent)

if __name__ == '__main__':
    asyncio.run(main())
