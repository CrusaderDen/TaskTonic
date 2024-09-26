import { useState } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import * as Select from '@radix-ui/react-select'

import s from './select.module.scss'

const options = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

export const Selector = () => {
  const [selected, setSelected] = useState(options[0].label)

  return (
    <Select.Root aria-label={'Themes'}>
      <Select.Trigger>
        <Select.Value placeholder={selected} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className={s.selectСontent} position={'popper'}>
          <Select.ScrollUpButton>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport>
            <Select.Group>
              <Select.Item value={options[0].value}>{options[0].label}</Select.Item>
              <Select.Item value={options[1].value}>{options[1].label}</Select.Item>
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
