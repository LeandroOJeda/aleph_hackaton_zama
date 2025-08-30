import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
export declare class GuestsService {
    create(createGuestDto: CreateGuestDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateGuestDto: UpdateGuestDto): string;
    remove(id: number): string;
}
