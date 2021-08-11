import express from 'express';
import cors from 'cors';
import { Mux } from './framework';

// Use JSON parse in all possible request
Mux.use(express.json());
Mux.use(cors());
