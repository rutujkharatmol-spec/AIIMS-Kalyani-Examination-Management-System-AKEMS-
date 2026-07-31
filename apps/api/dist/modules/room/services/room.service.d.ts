export declare class RoomService {
    findAll(): Promise<{
        id: string;
        room_number: string;
        exam_capacity: number;
        is_exam_centre: boolean;
    }[]>;
}
