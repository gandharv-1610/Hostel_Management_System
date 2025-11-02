const generateRoomId = (index) => `R${100 + index + 1}`;

const generateOccupantName = (index) => `Student_${String.fromCharCode(65 + index)}`;

const RoomState = new Map();

const SwapRequests = new Map();

function initializeRoomState(numRooms = 20) {
    for (let i = 0; i < numRooms; i++) {
        const roomId = generateRoomId(i);
        RoomState.set(roomId, {
            occupant: generateOccupantName(i),
            currentRoom: roomId
        });
    }
}

function initializeSwapRequests() {
    SwapRequests.set('R101', 'R102');
    SwapRequests.set('R102', 'R101');

    SwapRequests.set('R105', 'R106');
    SwapRequests.set('R106', 'R107');
    SwapRequests.set('R107', 'R105');

    SwapRequests.set('R110', 'R111');
    SwapRequests.set('R111', 'R112');

    SwapRequests.set('R115', 'R116');
}


class RoomSwapService {
    constructor(roomState, swapRequests) {
        this.roomState = roomState;
        this.swapRequests = swapRequests;
        this.processedRooms = new Set(); 
    }

    detectAndExecuteSwaps() {
        console.log("--- Starting Swap Processing ---");
        let cyclesFound = 0;

        for (const [requestingRoomId, targetRoomId] of this.swapRequests.entries()) {
            if (this.processedRooms.has(requestingRoomId)) {
                continue;
            }

            const cycle = this.findCycle(requestingRoomId);

            if (cycle.isCycle) {
                cyclesFound++;
                console.log(`\n✅ Cycle Detected (Cycle ${cyclesFound}):`);
                console.log(`   Path: ${cycle.path.join(' -> ')} -> ${cycle.path[0]}`);
                this.swapRoomsInCycle(cycle.path);
                
                cycle.path.forEach(roomId => this.processedRooms.add(roomId));

            } else {
                cycle.path.forEach(roomId => this.processedRooms.add(roomId));
            }
        }
        
        console.log(`\n--- Finished Processing. Total Cycles Found: ${cyclesFound} ---`);
    }

    findCycle(startRoomId) {
        let currentRoomId = startRoomId;
        const currentPath = [];
        const pathSet = new Set();

        while (this.swapRequests.has(currentRoomId) && !this.processedRooms.has(currentRoomId)) {
            if (pathSet.has(currentRoomId)) {
                const cycleStart = currentPath.indexOf(currentRoomId);
                const cyclePath = currentPath.slice(cycleStart);
                return { isCycle: true, path: cyclePath };
            }
            
            currentPath.push(currentRoomId);
            pathSet.add(currentRoomId);

            const nextRoomId = this.swapRequests.get(currentRoomId);

            if (nextRoomId === startRoomId) {
                return { isCycle: true, path: currentPath };
            }

            currentRoomId = nextRoomId;

            if (!this.roomState.has(currentRoomId) || !this.swapRequests.has(currentRoomId)) {
                break; 
            }
        }
        
        return { isCycle: false, path: currentPath };
    }

    swapRoomsInCycle(cyclePath) {
        if (cyclePath.length < 2) return;

        const temporaryOccupants = new Map();
        for (const roomId of cyclePath) {
            temporaryOccupants.set(roomId, { ...this.roomState.get(roomId) });
        }

        console.log(`   Executing Swap for ${cyclePath.length} students...`);

        const n = cyclePath.length;
        for (let i = 0; i < n; i++) {
            const currentRoomId = cyclePath[i]; 

            const targetRoomIndex = (i === 0) ? n - 1 : i - 1;
            const targetRoomId = cyclePath[targetRoomIndex];

            const movingOccupant = temporaryOccupants.get(currentRoomId).occupant;

            this.roomState.set(targetRoomId, {
                occupant: movingOccupant,
                currentRoom: targetRoomId
            });

            this.swapRequests.delete(currentRoomId);
        }

        console.log("   Swap successful. Requests removed for cycle members.");
    }
    
    printState(title = "CURRENT ROOM STATE") {
        console.log(`\n--- ${title} (Total Rooms: ${this.roomState.size}) ---`);
        console.log("Room ID | Occupant Name | Has Pending Request?");
        console.log("----------------------------------------------");
        
        const sortedRoomIds = Array.from(this.roomState.keys()).sort();

        sortedRoomIds.forEach(roomId => {
            const state = this.roomState.get(roomId);
            const hasRequest = this.swapRequests.has(roomId);
            
            const requestStatus = hasRequest 
                ? `WANTS ${this.swapRequests.get(roomId)}` 
                : 'No';

            console.log(
                `${roomId.padEnd(7)} | ${state.occupant.padEnd(13)} | ${requestStatus}`
            );
        });
        console.log("----------------------------------------------");
    }
}

initializeRoomState(20);
initializeSwapRequests();

const swapService = new RoomSwapService(RoomState, SwapRequests);

swapService.printState("INITIAL ROOM STATE AND PENDING REQUESTS");

swapService.detectAndExecuteSwaps();

swapService.printState("FINAL ROOM STATE AND REMAINING REQUESTS");
