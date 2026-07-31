import { RoomService } from '../services/room.service';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    getRooms(): Promise<{
        success: boolean;
        data: {
            id: string;
            room_number: string;
            exam_capacity: number;
            is_exam_centre: boolean;
        }[];
    }>;
}
