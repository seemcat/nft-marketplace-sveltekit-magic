import { Magic } from '@magic-sdk/admin';
import dotenv from 'dotenv';

dotenv.config();

const MAGIC_SECRET_KEY = process.env['MAGIC_SECRET_KEY'];
export const magicAdminSDK = new Magic(MAGIC_SECRET_KEY);