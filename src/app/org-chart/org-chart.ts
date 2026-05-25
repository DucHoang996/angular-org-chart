import { Component, OnInit } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-org-chart',
  imports: [OrganizationChartModule, FormsModule],
  templateUrl: './org-chart.html',
  standalone: true,
  styleUrl: './org-chart.css',
})

export class OrgChart implements OnInit {
  data: TreeNode[] = [
    {
    label: 'Le',
    type: 'person',
    expanded: true,
    data: {
        name: 'Lê Văn Lê',
        title: 'Senior Engineer',
        image: '/Le.jpg'
    },
    children: [
      {
        label: 'Hao',
        type: 'person',
        expanded: true,
        data: {
            name: 'Dư Vĩ Hào',
            title: 'Senior Engineer',
            image: '/Hao.jpg'
        },
        children: [
          {
            label: 'Anh',
            type: 'person',
            data: {
                name: 'Lê Hoàng Duy Anh',
                title: 'Engineer',
                image: '/Anh.jpg'
            },
          },
          {
            label: 'Huy',
            type: 'person',
            data: {
                name: 'Nguyễn Ngọc Thanh Huy',
                title: 'Senior Engineer',
                image: '/Huy.jpg'
            },
          }
        ]
      },
      {
        label: 'Linh',
        expanded: true,
        type: 'person',
        data: {
            name: 'Huỳnh Công Linh',
            title: 'Senior Engineer',
            image: '/Linh.jpg'
        },
        children: [
          {
            label: 'Minh',
            type: 'person',
            data: {
                name: 'Trần Ngọc Minh',
                title: 'Senior Engineer',
                image: '/Minh.jpg'
            },
          },
          {
            label: 'Thai',
            type: 'person',
            data: {
                name: 'Nguyễn Vũ Thái',
                title: 'Senior Engineer',
                image: '/Thai.jpg'
            },
          }
        ]
      }
    ]
  }
  ];

  selectedNodes!: TreeNode[];
  isEditMode: boolean = false;

  ngOnInit() {
  }

  createNode(node: TreeNode) {
    console.log(node)
  }

  editNode(node: TreeNode) {
    if (this.isEditMode) {
      this.isEditMode = false
    } else {
      this.isEditMode = true
    }
  }

  deleteNode(node: TreeNode) {
    console.log(node)
    this.data = this.removeNode(this.data, node.label || '')
    console.log(node)
  }

  removeNode(nodes: any[], label: string): any[] {
    return nodes
      .filter(node => node.label !== label)
      .map(node => ({
        ...node,
        children: node.children
          ? this.removeNode(node.children, label)
          : []
      }))
  }
}
