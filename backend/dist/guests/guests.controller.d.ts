import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
export declare class GuestsController {
    private readonly guestsService;
    constructor(guestsService: GuestsService);
    create(createGuestDto: CreateGuestDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateGuestDto: UpdateGuestDto): string;
    remove(id: string): string;
}
