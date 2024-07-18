import React from 'react'
import { useEffect, useCallback, useMemo } from 'react'

const ChildComp = ({ data, onClick }) => {
    return (
        <>
            <button onClick={onClick}>
                Click here
            </button>

        </>
    )
}
export default ChildComp;