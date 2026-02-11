```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../App'; // Assuming your main app component is App.js
import * as api from '../api'; // Assuming API functions are in api.js

jest.mock('../api');

describe('MINI React App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the Home page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      expect(
        screen.getByText(
          /You are in the View: application\/view\/home\/index\.php/i
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/In a real application this could be the homepage\./i)
      ).toBeInTheDocument();
    });

    it('renders the Example One page', () => {
      render(
        <MemoryRouter initialEntries={['/home/exampleone']}>
          <App />
        </MemoryRouter>
      );
      expect(
        screen.getByText(
          /You are in the View: application\/view\/home\/example_one\.php/i
        )
      ).toBeInTheDocument();
    });

    it('renders the Example Two page', () => {
      render(
        <MemoryRouter initialEntries={['/home/exampletwo']}>
          <App />
        </MemoryRouter>
      );
      expect(
        screen.getByText(
          /You are in the View: application\/view\/home\/example_two\.php/i
        )
      ).toBeInTheDocument();
    });

    it('renders the Problem (404) page for unknown route', () => {
      render(
        <MemoryRouter initialEntries={['/unknown/route']}>
          <App />
        </MemoryRouter>
      );
      expect(
        screen.getByText(
          /This is the Error-page\. Will be shown when a page \(= controller \/ method\) does not exist\./i
        )
      ).toBeInTheDocument();
    });

    it('renders the Songs page with song list and add form', async () => {
      api.getAllSongs.mockResolvedValue([
        {
          id: 1,
          artist: 'Dena',
          track: 'Cash, Diamond Ring, Swimming Pools',
          link: 'http://www.youtube.com/watch?v=r4CDc9yCAqE',
        },
      ]);
      api.getAmountOfSongs.mockResolvedValue(1);

      render(
        <MemoryRouter initialEntries={['/songs']}>
          <App />
        </MemoryRouter>
      );

      expect(
        await screen.findByText(
          /You are in the View: application\/view\/song\/index\.php/i
        )
      ).toBeInTheDocument();
      expect(screen.getByText(/Add a song/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Artist/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Track/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Link/i)).toBeInTheDocument();
      expect(screen.getByText(/Amount of songs \(data from second model\)/i)).toBeInTheDocument();
      expect(screen.getByText(/List of songs \(data from first model\)/i)).toBeInTheDocument();
      expect(await screen.findByText('Dena')).toBeInTheDocument();
      expect(await screen.findByText('Cash, Diamond Ring, Swimming Pools')).toBeInTheDocument();
    });

    it('renders the Edit Song page', async () => {
      api.getSong.mockResolvedValue({
        id: 1,
        artist: 'Dena',
        track: 'Cash, Diamond Ring, Swimming Pools',
        link: 'http://www.youtube.com/watch?v=r4CDc9yCAqE',
      });

      render(
        <MemoryRouter initialEntries={['/songs/editsong/1']}>
          <App />
        </MemoryRouter>
      );

      expect(
        await screen.findByText(
          /You are in the View: application\/view\/song\/edit\.php/i
        )
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Artist/i)).toHaveValue('Dena');
      expect(screen.getByLabelText(/Track/i)).toHaveValue('Cash, Diamond Ring, Swimming Pools');
      expect(screen.getByLabelText(/Link/i)).toHaveValue('http://www.youtube.com/watch?v=r4CDc9yCAqE');
    });
  });

  describe('Form Validation', () => {
    it('requires artist and track fields to add a song', async () => {
      api.getAllSongs.mockResolvedValue([]);
      api.getAmountOfSongs.mockResolvedValue(0);

      render(
        <MemoryRouter initialEntries={['/songs']}>
          <App />
        </MemoryRouter>
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(await screen.findAllByText(/required/i)).toHaveLength(2);
    });

    it('requires artist and track fields to edit a song', async () => {
      api.getSong.mockResolvedValue({
        id: 1,
        artist: '',
        track: '',
        link: '',
      });

      render(
        <MemoryRouter initialEntries={['/songs/editsong/1']}>
          <App />
        </MemoryRouter>
      );

      const artistInput = await screen.findByLabelText(/Artist/i);
      const trackInput = screen.getByLabelText(/Track/i);
      const submitButton = screen.getByRole('button', { name: /update/i });

      fireEvent.change(artistInput, { target: { value: '' } });
      fireEvent.change(trackInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      expect(await screen.findAllByText(/required/i)).toHaveLength(2);
    });
  });

  describe('User Interactions', () => {
    it('adds a song and refreshes the list', async () => {
      api.getAllSongs.mockResolvedValueOnce([]).mockResolvedValueOnce([
        {
          id: 2,
          artist: 'Jessy Lanza',
          track: 'Kathy Lee',
          link: 'http://vimeo.com/73455369',
        },
      ]);
      api.getAmountOfSongs.mockResolvedValue(0);
      api.addSong.mockResolvedValue({});

      render(
        <MemoryRouter initialEntries={['/songs']}>
          <App />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/Artist/i), {
        target: { value: 'Jessy Lanza' },
      });
      fireEvent.change(screen.getByLabelText(/Track/i), {
        target: { value: 'Kathy Lee' },
      });
      fireEvent.change(screen.getByLabelText(/Link/i), {
        target: { value: 'http://vimeo.com/73455369' },
      });

      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() =>
        expect(api.addSong).toHaveBeenCalledWith('Jessy Lanza', 'Kathy Lee', 'http://vimeo.com/73455369')
      );
      expect(await screen.findByText('Jessy Lanza')).toBeInTheDocument();
      expect(await screen.findByText('Kathy Lee')).toBeInTheDocument();
    });

    it('deletes a song from the list', async () => {
      api.getAllSongs.mockResolvedValue([
        {
          id: 1,
          artist: 'Dena',
          track: 'Cash, Diamond Ring, Swimming Pools',
          link: 'http://www.youtube.com/watch?v=r4CDc9yCAqE',
        },
      ]);
      api.getAmountOfSongs.mockResolvedValue(1);
      api.deleteSong.mockResolvedValue({});

      render(
        <MemoryRouter initialEntries={['/songs']}>
          <App />
        </MemoryRouter>
      );

      const deleteLink = await screen.findByText(/delete/i);
      fireEvent.click(deleteLink);

      await waitFor(() => expect(api.deleteSong).toHaveBeenCalledWith(1));
    });

    it('navigates to edit song page and updates a song', async () => {
      api.getAllSongs.mockResolvedValue([
        {
          id: 1,
          artist: 'Dena',
          track: 'Cash, Diamond Ring, Swimming Pools',
          link: 'http://www.youtube.com/watch?v=r4CDc9yCAqE',
        },
      ]);
      api.getAmountOfSongs.mockResolvedValue(1);
      api.getSong.mockResolvedValue({
        id: 1,
        artist: 'Dena',
        track: 'Cash, Diamond Ring, Swimming Pools',
        link: 'http://www.youtube.com/watch?v=r4CDc9yCAqE',
      });
      api.updateSong.mockResolvedValue({});

      render(
        <MemoryRouter initialEntries={['/songs']}>
          <App />
        </MemoryRouter>
      );

      const editLink = await screen.findByText(/edit/i);
      fireEvent.click(editLink);

      const artistInput = await screen.findByLabelText(/Artist/i);
      fireEvent.change(artistInput, { target: { value: 'Dena Updated' } });

      const submitButton = screen.getByRole('button', { name: /update/i });
      fireEvent.click(submitButton);

      await waitFor(() =>
        expect(api.updateSong).toHaveBeenCalledWith('Dena Updated', 'Cash, Diamond Ring, Swimming Pools', 'http://www.youtube.com/watch?v=r4CDc9yCAqE', 1)
      );
    });

    it('shows song count via AJAX on button click', async () => {
      api.getAllSongs.mockResolvedValue([]);
      api.getAmountOfSongs.mockResolvedValue(30);

      render(
        <MemoryRouter initialEntries={['/songs']}>
          <App />
        </MemoryRouter>
      );

      const ajaxButton = screen.getByRole('button', {
        name: /Click here to get the amount of songs via Ajax/i,
      });

      fireEvent.click(ajaxButton);

      await waitFor(() =>
        expect(screen.getByText('30')).toBeInTheDocument()
      );
    });
  });

  describe('API Call Mocking', () => {
    it('fetches songs and count from API', async () => {
      api.getAllSongs.mockResolvedValue([
        { id: 1, artist: 'Dena', track: 'Cash', link: '' },
      ]);
      api.getAmountOfSongs.mockResolvedValue(1);

      render(
        <MemoryRouter initialEntries={['/songs']}>
          <App />
        </MemoryRouter>
      );

      expect(await screen.findByText('Dena')).toBeInTheDocument();
      expect(await screen.findByText('1')).toBeInTheDocument();
      expect(api.getAllSongs).toHaveBeenCalled();
      expect(api.getAmountOfSongs).toHaveBeenCalled();
    });

    it('handles API error gracefully', async () => {
      api.getAllSongs.mockRejectedValue(new Error('API Error'));
      api.getAmountOfSongs.mockRejectedValue(new Error('API Error'));

      render(
        <MemoryRouter initialEntries={['/songs']}>
          <App />
        </MemoryRouter>
      );

      expect(await screen.findByText(/Failed to load songs/i)).toBeInTheDocument();
    });
  });

  describe('Route Protection', () => {
    it('redirects to Problem page for unknown routes', () => {
      render(
        <MemoryRouter initialEntries={['/notfound']}>
          <App />
        </MemoryRouter>
      );
      expect(
        screen.getByText(
          /This is the Error-page\. Will be shown when a page \(= controller \/ method\) does not exist\./i
        )
      ).toBeInTheDocument();
    });

    it('redirects to Problem page if editSong is accessed with invalid id', async () => {
      api.getSong.mockResolvedValue(null);

      render(
        <MemoryRouter initialEntries={['/songs/editsong/9999']}>
          <App />
        </MemoryRouter>
      );

      expect(
        await screen.findByText(
          /This is the Error-page\. Will be shown when a page \(= controller \/ method\) does not exist\./i
        )
      ).toBeInTheDocument();
    });
  });
});
```