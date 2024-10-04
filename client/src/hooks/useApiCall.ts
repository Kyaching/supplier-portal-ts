import {useCallback, useEffect, useState} from "react";
import {
  fetchData,
  removeData,
  sendData,
  updateData,
} from "../utilities/services";
import toast from "react-hot-toast";

export const usePost = <T>(url: string) => {
  const [status, setStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (payload: T) => {
    setLoading(true);
    setError(null);

    try {
      const result = await sendData(url, payload);
      if (result.success) {
        setStatus(result.success);
      }
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        toast.error("Something went wrong. Plese try again!");
        setError(err.message);
      } else setError("An Unknown Error Occurred");
    } finally {
      setLoading(false);
    }
  };
  return {status, loading, error, post};
};

export const useGet = <T>(url: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData<T>(url);
      setData(result);
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        setError(err.message);
      } else setError("An Unknown Error Occurred");
    } finally {
      setLoading(false);
    }
  }, [url]);
  useEffect(() => {
    get();
  }, [get]);
  return {data, loading, error, get};
};

export const useDelete = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await removeData(url);
      if (result.message) {
        toast.success(result.message);
      }
      setStatus(result.message);
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        setError(err.message);
      } else setError("An Unknown Error Occurred");
    } finally {
      setLoading(false);
    }
  };
  return {status, loading, error, remove};
};

export const useUpdate = <T>() => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (url: string, payload: T) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateData(url, payload);
      setStatus(result.message);
      toast.success(result.message);
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else setError("An Unknown Error Occurred");
    } finally {
      setLoading(false);
    }
  };
  return {status, loading, error, update};
};
