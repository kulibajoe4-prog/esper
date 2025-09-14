'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStructure } from '@/hooks/use-api';
import { fallbackData } from '@/lib/data';

export default function Filters() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedFaculty, setSelectedFaculty] = React.useState<string | null>(
    null
  );
  const [selectedDept, setSelectedDept] = React.useState<string | null>(null);
  const { structure, loading } = useStructure();

  // Utiliser les données de l'API ou les données de fallback
  const entities = structure?.entities || fallbackData.departments;
  const promotions = structure?.promotions || fallbackData.promotions;
  
  // Filtrer les facultés (niveau 1)
  const faculties = entities.filter(entity => entity.level === 1);
  
  // Filtrer les départements selon la faculté sélectionnée
  const availableDepts = selectedFaculty
    ? entities.filter(entity => entity.level === 2 && entity.parent_id === parseInt(selectedFaculty))
    : [];
    
  // Filtrer les promotions selon le département sélectionné
  const availablePromos = selectedDept
    ? promotions.filter(promo => promo.entityId === parseInt(selectedDept))
    : [];


  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select onValueChange={setSelectedFaculty}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder={loading ? "Loading..." : "Select Faculty"} />
        </SelectTrigger>
        <SelectContent>
          {faculties.map((faculty) => (
            <SelectItem key={faculty.id} value={faculty.id.toString()}>
              {faculty.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={setSelectedDept} disabled={!selectedFaculty}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder={loading ? "Loading..." : "Select Department"} />
        </SelectTrigger>
        <SelectContent>
          {availableDepts.map((dept) => (
            <SelectItem key={dept.id} value={dept.id.toString()}>
              {dept.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select disabled={!selectedDept}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder={loading ? "Loading..." : "Select Promotion"} />
        </SelectTrigger>
        <SelectContent>
          {availablePromos.map((promo) => (
            <SelectItem key={promo.id} value={promo.id.toString()}>
              {promo.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal md:w-auto',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Button>Apply Filters</Button>
    </div>
  );
}
