import { useState } from "react";

const useNewUseCase = () => {
    const [ newUseCase, setNewUseCase ] = useState<boolean>(false)
    if (newUseCase === undefined) throw new Error('newUseCase is undefined!')
    return { newUseCase, setNewUseCase }
}

export { useNewUseCase }