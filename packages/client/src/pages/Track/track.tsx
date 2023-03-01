import { Date } from '@components/Date.component';
import { DisplayCard } from "@components/DisplayCard.component";
import { displayData } from "@pages/Track/displayData";
import { ProjectTable } from "@components/table/ProjectTable";
import styled from 'styled-components';

export const Track = () => {

  const TrackContainer = styled.div`
    width: 100%;
    height: 10rem;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    align-items: start;
  `

  const DisplayContainer = styled.div`
    display: flex;
    gap: 4rem;
    align-items: center;
  `

  return (
      <TrackContainer>
          <DisplayContainer>
            <Date />
            {
              displayData.map((data)=>{
                return <DisplayCard key={data.id} item={data} />
              })
            }
          </DisplayContainer>
          <ProjectTable />
      </TrackContainer>
  )
}