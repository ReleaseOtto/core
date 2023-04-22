import {automate} from '../src/index';
import * as path from 'path';
describe('end to end', () => {  
    test('should work with test', async () => {
        await automate(path.resolve(__dirname, '../examples/asyncapi-typescript-models.json'));
    });
});