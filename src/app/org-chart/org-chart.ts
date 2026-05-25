import { Component, OnInit } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';


@Component({
  selector: 'app-org-chart',
  imports: [OrganizationChartModule],
  templateUrl: './org-chart.html',
  standalone: true,
  styleUrl: './org-chart.css',
})

export class OrgChart implements OnInit {
  data: TreeNode[] = [
    {
    label: 'Argentina',
    type: 'person',
    expanded: true,
    data: {
        sublabel: 'South america',
        image: '/argentina.png'
    },
    children: [
      {
        label: 'Argentina',
        type: 'person',
        expanded: true,
        data: {
            sublabel: 'South america',
            image: '/argentina.png'
        },
        children: [
          {
            label: 'Argentina',
            type: 'person',
            data: {
                sublabel: 'South america',
                image: '/argentina.png'
            },
          },
          {
            label: 'France',
            type: 'person',
            data: {
                sublabel: 'Euro',
                image: '/france.png'
            },
          }
        ]
      },
      {
        label: 'France',
        expanded: true,
        type: 'person',
        data: {
            sublabel: 'South america',
            image: '/france.png'
        },
        children: [
          {
            label: 'France',
            type: 'person',
            data: {
                sublabel: 'Euro',
                image: '/france.png'
            },
          },
          {
            label: 'Morocco',
            type: 'person',
            data: {
                sublabel: 'Euro',
                image: '/morocco.png'
            },
          }
        ]
      }
    ]
  }
  ];

  selectedNodes!: TreeNode[];

  ngOnInit() {
  }
}
