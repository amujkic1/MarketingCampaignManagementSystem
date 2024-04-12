import React from 'react';
import { render, screen } from '@testing-library/react';
import QRCode from '../components/Login/Login';
import {afterEach, describe, expect, test, vi} from "vitest"
import { BrowserRouter } from 'react-router-dom';
import Cookies from "js-cookie";
