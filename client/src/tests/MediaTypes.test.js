import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaTypes from '../components/MediaTypes/MediaTypes';
import {afterEach, describe, expect, test, vi} from "vitest"
import { BrowserRouter } from 'react-router-dom';
import Cookies from "js-cookie";

